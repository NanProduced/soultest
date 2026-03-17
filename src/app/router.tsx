import { createBrowserRouter, Navigate } from "react-router"

import { AdminLayout } from "@/app/layouts/admin-layout"
import { PublicLayout } from "@/app/layouts/public-layout"
import { ADMIN_PORTAL_BASE, LEGACY_ADMIN_PORTAL_BASE, buildAdminPortalPath } from "@/features/admin/constants"
import { AdminBatchesPage } from "@/pages/admin-batches-page"
import { AdminAnalyticsPage } from "@/pages/admin-analytics-page"
import { AdminDashboardPage } from "@/pages/admin-dashboard-page"
import { AdminProductsPage } from "@/pages/admin-products-page"
import { AdminQuizzesPage } from "@/pages/admin-quizzes-page"
import { AdminSecurityPage } from "@/pages/admin-security-page"
import { FreeAuraIntroPage } from "@/pages/free-aura-intro-page"
import { FreeAuraResultPage } from "@/pages/free-aura-result-page"
import { FreeAuraTestPage } from "@/pages/free-aura-test-page"
import { FreeBanweiIntroPage } from "@/pages/free-banwei-intro-page"
import { FreeBanweiResultPage } from "@/pages/free-banwei-result-page"
import { FreeBanweiTestPage } from "@/pages/free-banwei-test-page"
import { FreePaintingIntroPage } from "@/pages/free-painting-intro-page"
import { FreePaintingResultPage } from "@/pages/free-painting-result-page"
import { FreePaintingTestPage } from "@/pages/free-painting-test-page"
import { FreeTalentIntroPage } from "@/pages/free-talent-intro-page"
import { FreeTalentResultPage } from "@/pages/free-talent-result-page"
import { FreeTalentTestPage } from "@/pages/free-talent-test-page"
import { FreeSzondiIntroPage } from "@/pages/free-szondi-intro-page"
import { FreeSzondiTestPage } from "@/pages/free-szondi-test-page"
import { FreeSzondiResultPage } from "@/pages/free-szondi-result-page"
import { FreeSoulCityIntroPage } from "@/pages/free-soul-city-intro-page"
import { FreeSoulCityTestPage } from "@/pages/free-soul-city-test-page"
import { FreeSoulCityResultPage } from "@/pages/free-soul-city-result-page"
import { HomePage } from "@/pages/home-page"
import { QuizCatalogPage } from "@/pages/quiz-catalog-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { QuizDetailPage } from "@/pages/quiz-detail-page"
import { QuizResultPage } from "@/pages/quiz-result-page"
import { QuizTestPage } from "@/pages/quiz-test-page"

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "quizzes",
        element: <QuizCatalogPage />,
      },
      {
        path: "free/aura",
        element: <FreeAuraIntroPage />,
      },
      {
        path: "free/aura/test",
        element: <FreeAuraTestPage />,
      },
      {
        path: "free/aura/result",
        element: <FreeAuraResultPage />,
      },
      {
        path: "free/banwei",
        element: <FreeBanweiIntroPage />,
      },
      {
        path: "free/banwei/test",
        element: <FreeBanweiTestPage />,
      },
      {
        path: "free/banwei/result",
        element: <FreeBanweiResultPage />,
      },
      {
        path: "free/painting",
        element: <FreePaintingIntroPage />,
      },
      {
        path: "free/painting/test",
        element: <FreePaintingTestPage />,
      },
      {
        path: "free/painting/result",
        element: <FreePaintingResultPage />,
      },
      {
        path: "free/talent",
        element: <FreeTalentIntroPage />,
      },
      {
        path: "free/talent/test",
        element: <FreeTalentTestPage />,
      },
      {
        path: "free/talent/result",
        element: <FreeTalentResultPage />,
      },
      {
        path: "free/szondi",
        element: <FreeSzondiIntroPage />,
      },
      {
        path: "free/szondi/test",
        element: <FreeSzondiTestPage />,
      },
      {
        path: "free/szondi/result",
        element: <FreeSzondiResultPage />,
      },
      {
        path: "free/soul-city",
        element: <FreeSoulCityIntroPage />,
      },
      {
        path: "free/soul-city/test",
        element: <FreeSoulCityTestPage />,
      },
      {
        path: "free/soul-city/result",
        element: <FreeSoulCityResultPage />,
      },
      {
        path: ":slug",
        element: <QuizDetailPage />,
      },
      {
        path: ":slug/test",
        element: <QuizTestPage />,
      },
      {
        path: ":slug/result/:submissionId",
        element: <QuizResultPage />,
      },
    ],
  },
  {
    path: ADMIN_PORTAL_BASE,
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "analytics",
        element: <AdminAnalyticsPage />,
      },
      {
        path: "quizzes",
        element: <AdminQuizzesPage />,
      },
      {
        path: "products",
        element: <AdminProductsPage />,
      },
      {
        path: "batches",
        element: <AdminBatchesPage />,
      },
      {
        path: "policies",
        element: <Navigate replace to={buildAdminPortalPath("batches")} />,
      },
      {
        path: "security",
        element: <AdminSecurityPage />,
      },
    ],
  },
  {
    path: `${LEGACY_ADMIN_PORTAL_BASE}/*`,
    element: <NotFoundPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])



