import Primary_navbar from "@/app/components/navbar/primary_navbar";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it } from "node:test";

describe("page", () => {
  it("render image", () => {
    render(<Primary_navbar profile={null} friends={[]} notifications={[]} />);
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
});
