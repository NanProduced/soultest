import { createBrowserRouter } from "react-router"

import { AdminLayout } from "@/app/layouts/admin-layout"
import { PublicLayout } from "@/app/layouts/public-layout"
import { ADMIN_PORTAL_BASE, LEGACY_ADMIN_PORTAL_BASE } from "@/features/admin/constants"
import { AdminDashboardPage } from "@/pages/admin-dashboard-page"
import { AdminQuizzesPage } from "@/pages/admin-quizzes-page"
import { FreeAuraIntroPage } from "@/pages/free-aura-intro-page"
import { FreeAuraResultPage } from "@/pages/free-aura-result-page"
import { FreeAuraTestPage } from "@/pages/free-aura-test-page"
import { FreeBanweiIntroPage } from "@/pages/free-banwei-intro-page"
import { FreeBanweiResultPage } from "@/pages/free-banwei-result-page"
import { FreeBanweiTestPage } from "@/pages/free-banwei-test-page"
import { FreePaintingIntroPage } from "@/pages/free-painting-intro-page"
import { FreePaintingResultPage } from "@/pages/free-painting-result-page"
import { FreePaintingTestPage } from "@/pages/free-painting-test-page"
import { HomePage } from "@/pages/home-page"
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
        path: "quizzes",
        element: <AdminQuizzesPage />,
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