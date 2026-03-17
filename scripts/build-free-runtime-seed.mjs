import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import ts from "typescript"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, "..")
const tempDir = path.join(projectRoot, ".tmp-free-runtime-build")
const outputFile = path.join(projectRoot, "db", "seeds", "free-runtime.sql")

const seedTargets = [
  {
    slug: "free/aura",
    versionId: "quiz_version_free_aura_v1",
    sourceFile: "src/features/free-quizzes/aura-data.ts",
    buildPayload: (module) => ({
      questions: module.auraQuestions,
      results: recordToResultsArray(module.auraResults),
      freeRuntime: {
        questionSet: module.auraQuestions,
        resultMap: module.auraResults,
        calculator: "calculateAuraResult",
        scoringMode: "dual-axis-quadrant",
      },
    }),
  },
  {
    slug: "free/banwei",
    versionId: "quiz_version_free_banwei_v1",
    sourceFile: "src/features/free-quizzes/banwei-data.ts",
    buildPayload: (module) => ({
      questions: module.banweiQuestions,
      results: recordToResultsArray(module.banweiResults),
      freeRuntime: {
        questionSet: module.banweiQuestions,
        resultMap: module.banweiResults,
        dimensionNames: module.DIMENSION_NAMES,
        calculator: "calculateBanweiResult",
        percentCalculator: "calculateDimensionPercent",
        scoringMode: "range+dimension",
      },
    }),
  },
  {
    slug: "free/painting",
    versionId: "quiz_version_free_painting_v1",
    sourceFile: "src/features/free-quizzes/painting-data.ts",
    buildPayload: (module) => ({
      questions: module.paintingQuestions,
      results: recordToResultsArray(module.paintingResults),
      freeRuntime: {
        questionSet: module.paintingQuestions,
        resultMap: module.paintingResults,
        dimensionRanges: module.DIMENSION_RANGES,
        dimensionLabels: module.DIMENSION_LABELS,
        paintingRelations: module.PAINTING_RELATIONS,
        calculator: "calculatePaintingResult",
        scoringMode: "cosine-similarity",
      },
    }),
  },
  {
    slug: "free/talent",
    versionId: "quiz_version_free_talent_v1",
    sourceFile: "src/features/free-quizzes/talent-data.ts",
    buildPayload: (module) => ({
      questions: module.talentQuestions,
      results: recordToResultsArray(module.talentResults),
      freeRuntime: {
        questionSet: module.talentQuestions,
        resultMap: module.talentResults,
        calculator: "calculateTalentResult",
        scoringMode: "dimension-top-match",
      },
    }),
  },
  {
    slug: "free/szondi",
    versionId: "quiz_version_free_szondi_v1",
    sourceFile: "src/features/free-quizzes/szondi-data.ts",
    buildPayload: (module) => ({
      questions: module.situationalQuestions,
      results: recordToResultsArray(module.szondiFactors),
      freeRuntime: {
        factorMap: module.szondiFactors,
        faceSets: module.fullFacesSets,
        situationalQuestions: module.situationalQuestions,
        scoringMode: "image-selection-factor",
      },
    }),
  },
  {
    slug: "free/soul-city",
    versionId: "quiz_version_free_soul_city_v1",
    sourceFile: "src/features/free-quizzes/soul-city-data.ts",
    buildPayload: (module) => ({
      questions: module.soulCityQuestions,
      results: recordToResultsArray(module.soulCityResults),
      freeRuntime: {
        questionSet: module.soulCityQuestions,
        resultMap: module.soulCityResults,
        calculator: "calculateSoulCityResult",
        scoringMode: "city-archetype-match",
      },
    }),
  },
]

function normalizeSummary(value) {
  const candidates = [
    value.summary,
    value.description,
    value.tagline,
    value.subtitle,
    value.brief,
    value.quote,
    value.overview,
    value.analysis?.origin?.[0],
    value.analysis?.behavior?.[0],
  ]

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim()
    }
  }

  return ""
}

function recordToResultsArray(record) {
  return Object.entries(record).map(([entryKey, rawValue]) => {
    const value = rawValue && typeof rawValue === "object" ? rawValue : {}
    const key = typeof value.key === "string" && value.key.trim() ? value.key : entryKey
    const titleCandidates = [value.title, value.name, value.heroTitle, value.nickname, entryKey]
    const title = titleCandidates.find((candidate) => typeof candidate === "string" && candidate.trim()) ?? entryKey

    return {
      key,
      title,
      summary: normalizeSummary(value),
      ...value,
    }
  })
}

function escapeSqlString(value) {
  return value.replaceAll("'", "''")
}

async function loadTsModule(relativePath) {
  const sourcePath = path.join(projectRoot, relativePath)
  const sourceText = await readFile(sourcePath, "utf8")
  const transpiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    },
    fileName: sourcePath,
  })

  const outputPath = path.join(tempDir, relativePath.replace(/[\\/]/g, "__").replace(/\.ts$/, ".mjs"))
  await writeFile(outputPath, transpiled.outputText, "utf8")
  return await import(`${pathToFileURL(outputPath).href}?t=${Date.now()}`)
}

async function main() {
  await rm(tempDir, { recursive: true, force: true })
  await mkdir(tempDir, { recursive: true })

  const statements = [
    "-- Auto-generated by scripts/build-free-runtime-seed.mjs",
    "-- Do not hand-edit unless you know the static source and D1 seed are intentionally diverging.",
    "",
  ]

  for (const target of seedTargets) {
    const module = await loadTsModule(target.sourceFile)
    const payload = target.buildPayload(module)
    const questionsJson = escapeSqlString(JSON.stringify(payload.questions))
    const resultsJson = escapeSqlString(JSON.stringify(payload.results))
    const freeRuntimeJson = escapeSqlString(JSON.stringify({
      slug: target.slug,
      sourceFile: target.sourceFile,
      ...payload.freeRuntime,
    }))

    statements.push(
      `UPDATE quiz_versions\nSET config_json = json_set(\n  config_json,\n  '$.questions', json('${questionsJson}'),\n  '$.results', json('${resultsJson}'),\n  '$.extensions.freeRuntime', json('${freeRuntimeJson}')\n)\nWHERE id = '${target.versionId}';`,
      "",
    )
  }

  await writeFile(outputFile, `${statements.join("\n")}\n`, "utf8")
  await rm(tempDir, { recursive: true, force: true })
  console.log(`Generated ${path.relative(projectRoot, outputFile)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
