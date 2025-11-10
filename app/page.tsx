import Link from 'next/link';

interface TopicCardProps {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  href: string;
}

function TopicCard({ title, description, difficulty, href }: TopicCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <Link href={href}>
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className={`text-xs px-2 py-1 rounded ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Semiconductor Visualization
          </h1>
          <p className="text-xl text-gray-600">
            Interactive exploration of IC fabrication and device physics
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Individual Devices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TopicCard
              title="NMOS Transistor"
              description="Metal-Oxide-Semiconductor Field-Effect Transistor fundamentals"
              difficulty="beginner"
              href="/devices/nmos-transistor"
            />
            <TopicCard
              title="PMOS Transistor"
              description="P-channel MOSFET structure and operation"
              difficulty="beginner"
              href="/devices/pmos-transistor"
            />
            <TopicCard
              title="PN Junction Diode"
              description="Basic semiconductor diode physics"
              difficulty="beginner"
              href="/devices/pn-diode"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Integrated Circuits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TopicCard
              title="CPU Fabrication"
              description="Complete CMOS logic fabrication process"
              difficulty="advanced"
              href="/ics/cpu-fabrication"
            />
            <TopicCard
              title="NAND Flash Memory"
              description="Non-volatile memory cell structure and operation"
              difficulty="advanced"
              href="/ics/nand-flash"
            />
            <TopicCard
              title="DRAM Cell"
              description="Dynamic random access memory fundamentals"
              difficulty="intermediate"
              href="/ics/dram"
            />
          </div>
        </section>

        <footer className="text-center text-gray-500 mt-16">
          <p>Open source educational project • Built with Next.js & Three.js</p>
        </footer>
      </div>
    </div>
  );
}