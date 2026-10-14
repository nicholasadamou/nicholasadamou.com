import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../utils";
import ContactPageClient from "@/app/contact/ContactPageClient";

describe("contact submission availability", () => {
  it("requires valid fields and disables again when a field becomes invalid", async () => {
    const user = userEvent.setup();
    render(<ContactPageClient />);
    const button = screen.getByRole("button", { name: "Send project brief" });
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText("Your name *"), "Test Client");
    await user.type(screen.getByLabelText("Email address *"), "invalid");
    await user.selectOptions(
      screen.getByLabelText("What do you need? *"),
      "New website"
    );
    await user.selectOptions(
      screen.getByLabelText("When would you like to start? *"),
      "Within a month"
    );
    await user.type(
      screen.getByLabelText("What would a successful project look like? *"),
      "A useful website for my growing business."
    );
    expect(button).toBeDisabled();
    await user.clear(screen.getByLabelText("Email address *"));
    await user.type(
      screen.getByLabelText("Email address *"),
      "client@example.com"
    );
    await waitFor(() => expect(button).toBeEnabled());
    await user.clear(screen.getByLabelText("Your name *"));
    await waitFor(() => expect(button).toBeDisabled());
  });
});
