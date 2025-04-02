import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

export default function MetaData({ title, description, keywords, author }) {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title || "Default Title"}</title>
        <meta
          name="description"
          content={description || "Default Description"}
        />
        <meta name="keywords" content={keywords || "Default Keywords"} />
        <meta name="author" content={author || "Default Author"} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
    </HelmetProvider>
  );
}
