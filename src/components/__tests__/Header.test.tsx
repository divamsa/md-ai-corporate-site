import { render, screen } from "@testing-library/react";
import Header from "../Header";

describe("Header", () => {
  it("renders the company name", () => {
    render(<Header />);
    expect(screen.getByText("MD")).toBeInTheDocument();
    expect(screen.getByText("マネーデザイン")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByText("サービス")).toBeInTheDocument();
    expect(screen.getByText("お問い合わせ")).toBeInTheDocument();
  });
});
