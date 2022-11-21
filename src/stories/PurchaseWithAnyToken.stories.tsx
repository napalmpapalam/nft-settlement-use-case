import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { DemoInstructions as DemoInstructionsC } from "./DemoInstructions";
import { PurchaseWithAnyToken as PurchaseWithAnyTokenC } from "./PurchaseWithAnyToken";

export default {
  title: "Demo/PurchaseWithAnyToken",
  component: PurchaseWithAnyTokenC,
} as ComponentMeta<typeof PurchaseWithAnyTokenC>;

const Template: ComponentStory<typeof PurchaseWithAnyTokenC> = (args) => (
  <PurchaseWithAnyTokenC {...args} />
);

export const Demo = Template.bind({});
Demo.args = {
  buttonProps: {
    label: "Purchase with any token",
    styles: {
      backgroundColor: "#000000",
      fontWeight: "bold",
    },
  },
  // More on composing args: https://storybook.js.org/docs/react/writing-stories/args#args-composition
};

const DemoInstructionsTemplate: ComponentStory<typeof DemoInstructionsC> =
  () => <DemoInstructionsC />;

export const DemoInstructions = DemoInstructionsTemplate.bind({});
