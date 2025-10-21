import { render } from "@testing-library/react";
import { StepWrapper } from "../StepWrapper";

describe("StepWrapper", () => {
  it("renders the Todo Óptica watermark by default", () => {
    const { container } = render(
      <StepWrapper title="Test title">
        <p>Contenido de prueba</p>
      </StepWrapper>,
    );

    const watermark = container.querySelector('img[aria-hidden="true"][src="/logo-todo-optica.svg"]');
    expect(watermark).not.toBeNull();
  });

  it("allows disabling the watermark when requested", () => {
    const { container } = render(
      <StepWrapper title="Sin marca" watermark={false}>
        <p>Sin marca de agua</p>
      </StepWrapper>,
    );

    const watermark = container.querySelector('img[aria-hidden="true"][src="/logo-todo-optica.svg"]');
    expect(watermark).toBeNull();
  });
});
