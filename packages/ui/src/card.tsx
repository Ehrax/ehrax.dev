import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./card.module.css";

export type CardProps = ComponentPropsWithoutRef<"div"> & {
  interactive?: boolean;
};

function CardRoot({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={clsx(styles.card, className)}
      data-interactive={interactive || undefined}
      {...props}
    />
  );
}

const Header = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={clsx(styles.header, className)} {...props} />
);
const Title = ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
  <h3 className={clsx(styles.title, className)} {...props} />
);
const Description = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p className={clsx(styles.description, className)} {...props} />
);
const Content = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={clsx(styles.content, className)} {...props} />
);
const Footer = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={clsx(styles.footer, className)} {...props} />
);
const Action = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={clsx(styles.action, className)} {...props} />
);

/**
 * Card with optional compound anatomy:
 *   <Card>
 *     <Card.Header><Card.Title/><Card.Description/><Card.Action/></Card.Header>
 *     <Card.Content/>
 *     <Card.Footer/>
 *   </Card>
 * A premium Linear-style raised surface: lit top edge, hairline border, soft
 * shadow, and a subtle lift on hover when `interactive`.
 */
export const Card = Object.assign(CardRoot, {
  Header,
  Title,
  Description,
  Content,
  Footer,
  Action,
});
