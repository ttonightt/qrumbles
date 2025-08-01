import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"

import { ProjectEditor } from "../src/pages/editor"
import { CreateProject } from "../src/pages/create-project"
import { Lab } from "./dev/lab"
import { Example as BulgedLab } from "./dev/dev-bulged"

import "./style.css";

export const DOWNLOADER = document.createElement("a");

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/editor" element={<ProjectEditor/>} />
				<Route path="/create" element={<CreateProject/>} />
				<Route path="/dev/lab" element={<Lab/>} />
				<Route path="/dev/bulged" element={<BulgedLab/>} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
