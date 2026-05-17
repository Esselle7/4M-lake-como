import BookingForm from '@/components/sections/BookingForm'

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-white-warm">
      {/* Top spacer so content clears the fixed nav */}
      <div className="pt-28" />
      <BookingForm />
    </main>
  )
}
