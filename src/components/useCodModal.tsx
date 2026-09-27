import { useState } from "react";
import type { Product } from "../lib/types";
import CodOrderModal from "./CodOrderModal";
import type { ReactNode } from "react";

/**
 * Provides COD modal state to any page that renders product grids.
 */
export function useCodModal() {
  const [codProduct, setCodProduct] = useState<Product | null>(null);
  const modal = (
    <CodOrderModal
      product={codProduct}
      open={codProduct !== null}
      onClose={() => setCodProduct(null)}
    />
  );
  return { openCod: setCodProduct, codModal: modal as ReactNode };
}
