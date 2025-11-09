import { useEffect, useRef, useState } from 'react';
import { getCars } from '../services/api';
import CarCard from '../components/CarCard';

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const LIMIT = 24;

  useEffect(() => {
    const fetchFirst = async () => {
      try {
        const data = await getCars({ limit: LIMIT, page: 1 });
        setCars(Array.isArray(data) ? data : []);
        setHasMore(Array.isArray(data) ? data.length === LIMIT : false);
        setPage(2);
      } catch (err) {
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    };
    fetchFirst();
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    const el = observerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          try {
            const data = await getCars({ limit: LIMIT, page });
            const list = Array.isArray(data) ? data : [];
            setCars((prev) => [...prev, ...list]);
            if (list.length < LIMIT) setHasMore(false);
            setPage((p) => p + 1);
          } catch {
            setHasMore(false);
          } finally {
            setLoadingMore(false);
          }
        }
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [page, hasMore, loadingMore]);

  if (loading) return <p className='text-center mt-10'>Loading cars...</p>;
  if (error) return <p className='text-center text-red-600 mt-10'>{error}</p>;

  return (
    <>
      <div className='p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      {hasMore && (
        <div ref={observerRef} className='h-10 flex items-center justify-center'>
          {loadingMore ? (
            <span className='text-gray-500 text-sm'>Loading more…</span>
          ) : (
            <span className='text-gray-400 text-sm'>Scroll to load more</span>
          )}
        </div>
      )}
    </>
  );
}
