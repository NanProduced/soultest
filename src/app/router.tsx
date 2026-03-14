import { createBrowserRouter } from "react-router"

import { AdminLayout } from "@/app/layouts/admin-layout"
import { PublicLayout } from "@/app/layouts/public-layout"
import { AdminDashboardPage } from "@/pages/admin-dashboard-page"
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
