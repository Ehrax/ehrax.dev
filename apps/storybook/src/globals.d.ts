declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

// Side-effect imports of plain stylesheets (incl. package subpath .css exports).
declare module "*.css";
