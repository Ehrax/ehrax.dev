declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

// Side-effect imports of plain stylesheets.
declare module "*.css";
