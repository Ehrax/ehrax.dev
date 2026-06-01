import { Card, Heading, Stack, Text } from "@ehrax/ui";
import type { WorkCard as WorkCardType } from "~/types/site";
import styles from "./WorkCard.module.css";

type WorkCardProps = {
  card: WorkCardType;
};

export function WorkCard({ card }: WorkCardProps) {
  return (
    <Card className={styles.card}>
      <Card.Content>
        <Stack gap={2}>
          <Text variant="overline" tone="tertiary">
            {card.role}
          </Text>
          <Heading as="h3" level="h4" id={`${card.id}-title`}>
            {card.title}
          </Heading>
          <Text variant="body" tone="secondary">
            {card.summary}
          </Text>
        </Stack>
      </Card.Content>
    </Card>
  );
}
