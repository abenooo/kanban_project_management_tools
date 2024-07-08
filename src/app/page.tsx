import Kanban from "../componet/kanban";
import { ThemeProvider } from "../componet/DarkTheme";
export default function Home() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Kanban />
      </ThemeProvider>
    </>
  );
}
