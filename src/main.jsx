import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider, Link, useRouteError } from "react-router"

import { Editor } from "../pages/editor"
import { Lab } from "../labs/lab"
import { Example as BulgedLab } from "../labs/dev-bulged"

import "./style.css"

export const DOWNLOADER = document.createElement("a");

const ROUTER = createBrowserRouter([
	{
		path: "/editor",
		element: <Editor/>
	},
	{
		path: "/dev/lab",
		element: <Lab/>
	},
	{
		path: "/dev/bulged",
		element: <BulgedLab/>
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={ROUTER}/>
	</StrictMode>
)
