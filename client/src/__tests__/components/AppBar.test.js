import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ResponsiveAppBar from "../../component/AppBar";

test("verify buttons on appbar", () => {
  render(
    <BrowserRouter>
      <ResponsiveAppBar />
    </BrowserRouter>
  );
  // ASSERT Buttons Working
   expect(screen.getByRole('button',  { name: "Dashboard"})).not.toBeDisabled();
   expect(screen.getByRole('button',  { name: "StaticPage"})).not.toBeDisabled();
   expect(screen.getByRole('button',  { name: "Toolbox"})).not.toBeDisabled();
   expect(screen.getByRole('button',  { name: "xs-side-nav"})).not.toBeDisabled();
   expect(screen.getByRole('button',  { name: "open drawer"})).not.toBeDisabled();

   expect(screen.getByTitle("home")).toHaveTextContent("SIMonit");
   expect(screen.getByTitle("xs-home")).toHaveTextContent("SIMonit");

  //screen.debug();
});
