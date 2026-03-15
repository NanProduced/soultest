import { createBrowserRouter } from "react-router"

import { AdminLayout } from "@/app/layouts/admin-layout"
import { PublicLayout } from "@/app/layouts/public-layout"
import { AdminDashboardPage } from "@/pages/admin-dashboard-page"
import { HomePage } from "@/pages/home-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { QuizDetailPage } from "@/pages/quiz-detail-page"
import { QuizResultPage } from "@/pages/quiz-result-page"
import { QuizTestPage } from "@/pages/quiz-test-page"
import { FreeAuraIntroPage } from "@/pages/free-aura-intro-page"
import { FreeAuraTestPage } from "@/pages/free-aura-test-page"
import { FreeAuraResultPage } from "@/pages/free-aura-result-page"
import { FreeBanweiIntroPage } from "@/pages/free-banwei-intro-page"
import { FreeBanweiTestPage } from "@/pages/free-banwei-test-page"
import { FreeBanweiResultPage } from "@/pages/free-banwei-result-page"

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
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])
