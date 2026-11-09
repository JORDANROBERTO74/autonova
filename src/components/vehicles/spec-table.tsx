import type { Vehicle } from "@/lib/vehicles";
import { specRows } from "@/lib/vehicles";

export function SpecTable({ vehicle }: { vehicle: Vehicle }) {
  const rows = specRows(vehicle.specs);

  return (
    <div className="border-t border-ink/15">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Especificaciones técnicas de {vehicle.name}
        </caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-ink/10">
              <th
                scope="row"
                className="w-1/2 py-3.5 pr-4 text-left align-top font-mono text-[11px] font-normal uppercase tracking-label text-steel sm:w-2/5"
              >
                {row.label}
              </th>
              <td className="py-3.5 text-right align-top font-medium sm:text-left">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
