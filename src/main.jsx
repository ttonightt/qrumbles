import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider, Link, useRouteError } from "react-router"

import { ProjectEditor } from "../pages/editor"
import { CreateProject } from "../pages/create-project"
import { Lab } from "../labs/lab"
import { Example as BulgedLab } from "../labs/dev-bulged"

import "./style.css"

export const DOWNLOADER = document.createElement("a");

const ROUTER = createBrowserRouter([
	{
		path: "/editor",
		element: <ProjectEditor/>
	},
	{
		path: "/create",
		element: <CreateProject/>
	},
	{
		path: "/dev/lab",
		element: <Lab/>
	},
	{
		path: "/dev/bulged",
		element: <BulgedLab/>
	}
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={ROUTER}/>
	</StrictMode>
);
