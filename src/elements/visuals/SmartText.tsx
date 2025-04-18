import { Paragraph, styled } from "tamagui";

export const TruncatedText = styled(Paragraph, {
  numberOfLines: 1,
  ellipsizeMode: "tail",
  whiteSpace: "nowrap",
  userSelect: "none",
});
