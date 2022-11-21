import "@testing-library/jest-dom";

import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";

import Select from "./Select";

const mockSelectOptions = [
  {
    value: "rarimo",
    label: "Rarimo",
  },
];
describe("Select", () => {
  test("renders the Select component", () => {
    const { getAllByText } = render(
      <Select label="Hello Select!" options={mockSelectOptions} />
    );
    expect(getAllByText("Hello Select!")).toHaveLength(2);
  });

  test("should call onChange function when a user selects an option", async () => {
    const onChange = jest.fn();
    const { getByText, getByTestId } = render(
      <Select
        label="Hello Select!"
        options={mockSelectOptions}
        onChange={onChange}
      />
    );

    const select = await waitFor(() => getByTestId("rarimo-select"));
    fireEvent.change(select, {
      target: { value: "rarimo" },
    });

    expect(onChange).toBeCalled();

    expect(getByText("Rarimo")).toBeInTheDocument();
  });
});
