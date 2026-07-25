import { useStore } from "../../contexts/StoreContext";
import { formatDateTime } from "../../lib/format";

export default function LogsTab() {
  const { logs } = useStore();

  if (logs.length === 0) {
    return (
      <div className="empty-state">
        <h2>Nenhuma atividade registrada</h2>
        <p>As ações da equipe e dos clientes aparecerão neste histórico.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Data e hora</th>
            <th>Responsável</th>
            <th>Atividade</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td data-label="Data e hora">{formatDateTime(log.createdAt)}</td>
              <td data-label="Responsável">{log.actor}</td>
              <td data-label="Atividade">{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
