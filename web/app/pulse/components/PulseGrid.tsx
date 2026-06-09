import { PulseItem } from '../data';

interface PulseGridProps {
  filteredData: PulseItem[];
}

export function PulseGrid({ filteredData }: PulseGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-700'
      case 'update': return 'bg-amber-100 text-amber-700'
      case 'new': return 'bg-blue-100 text-blue-700'
      case 'beta': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <section className="px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-solo-primary">{item.tool}</h3>
                  <p className="text-xs text-gray-500">{item.registry}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">v{item.version}</span>
                <span className="text-gray-400">{item.updated}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
