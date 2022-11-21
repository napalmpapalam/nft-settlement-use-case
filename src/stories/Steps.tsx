import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import * as React from "react";

const BoldItalicText = ({ text }: { text: string }) => (
  <i style={{ fontWeight: "bold" }}>{text}</i>
);
const steps = [
  {
    label:
      "Connect a Goerli network in Metamask (to demo you must have at least 0.1 UNI token))",
    description: (
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography>If you don’t have any UNI:</Typography>
        <Box marginLeft={2}>
          <Typography>
            A: Obtain <BoldItalicText text="Goerli ETH" />, use the following
            faucet:{" "}
            <Link target="_blank" href="https://goerlifaucet.com/">
              here
            </Link>{" "}
            or{" "}
            <Link target="_blank" href="https://goerli-faucet.pk910.de/">
              here
            </Link>
            .
          </Typography>
          <Typography>
            B: Obtain <BoldItalicText text="UNI" /> token by Swapping{" "}
            <BoldItalicText text="Goerli ETH" />
            <BoldItalicText text="UNI" /> token using Uniswap{" "}
            <Link
              target="_blank"
              href="https://app.uniswap.org/#/swap?chain=goerli"
            >
              here
            </Link>
            .
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    label: "Connect MetaMask Wallet to Demo",
    description: (
      <Box display="flex" gap={1} flexDirection="column" marginLeft={2}>
        <Typography>
          A: Navigate to the{" "}
          <Link
            href="/platform-engineering/demo-settlement/?path=/story/demo-purchasewithanytoken--demo&full=true"
            target="_blank"
          >
            demo page
          </Link>{" "}
          & click <BoldItalicText text="Purchase with Token button" />.
        </Typography>
        <Typography>B: Follow Prompts to connect metamask</Typography>
        <Typography>
          C: For demo purposes, select <BoldItalicText text="UNI token" /> as a
          payment token
        </Typography>
      </Box>
    ),
  },
  {
    label: "Review price & Checkout",
    description: (
      <Box display="flex" gap={1} flexDirection="column" marginLeft={2}>
        <Typography>
          {" "}
          A: Review the price and click on the{" "}
          <BoldItalicText text="Checkout button" />.
        </Typography>
        <Typography>
          B: Approve spending of UNI token & transaction in Metamask Pop-Up.
        </Typography>
      </Box>
    ),
  },
  {
    label: "See NFT in metamask",
    description: (
      <Box display="flex" gap={1} flexDirection="column">
        After the transaction has been completed:
        <Box display="flex" gap={1} flexDirection="column" marginLeft={2}>
          <Typography>
            A: switch the chain in metamask from Goerli network to Sepolia
            network.
          </Typography>
          <Typography>
            B: Scroll down and click on <BoldItalicText text="import token" />.
          </Typography>
          <Typography>
            C: A Custom Token screen will appear. Add following details:
          </Typography>
          <Box display="flex" gap={1} flexDirection="column" marginLeft={4}>
            <Typography sx={{ fontWeight: "bold" }}>
              Token contract address:{" "}
            </Typography>
            <Typography sx={{ fontStyle: "italic" }}>
              0x77FEdfb705C8baC2E03aAD2Ad8A8Fe83e3E20FA1
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>Token symbol: </Typography>{" "}
            <Typography sx={{ fontStyle: "italic" }}>RNFT</Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              Token Decimal:{" "}
            </Typography>{" "}
            <Typography sx={{ fontStyle: "italic" }}>0</Typography>
          </Box>
        </Box>
      </Box>
    ),
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ minWidth: "100%" }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 3 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              <Typography sx={{ fontWeight: "bold" }}>{step.label}</Typography>
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1, textTransform: "none" }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1, textTransform: "none" }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button
            onClick={handleReset}
            sx={{ mt: 1, mr: 1, textTransform: "none" }}
          >
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
