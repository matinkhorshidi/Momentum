// components/ui/Skeleton.jsx
export default function Skeleton({ height = 100 }) {
  return (
    <div
      className="bg-gray-300 animate-pulse rounded-md"
      style={{ height: `${height}px`, width: '100%' }}
    />
  );
}
