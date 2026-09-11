/**
 * The photographs band — the thing most visitors are here for this week, so
 * it sits high on the page. Full-width navy panel with gold accents, a large
 * gallery button, and the password in plain sight in large type. The password
 * is deliberately never hidden behind a click or tooltip.
 */

const GALLERY_URL =
  'https://cvphotos.photoshelter.com/gallery/260910-Lincolnshire-Marketing-Awards/G0000zjUAZHbk5S0'

export default function PhotoGallery() {
  return (
    <section
      aria-labelledby="photos-heading"
      className="relative overflow-hidden py-14 md:py-20"
      style={{
        background: 'linear-gradient(145deg, #040f2e 0%, #071d52 40%, #0a2d6e 100%)',
      }}
    >
      {/* Gold accent lines top and bottom */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(to right, transparent, #c9a84c 30%, #dda03a 60%, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(to right, transparent, #dda03a 40%, #c9a84c 70%, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 700px 320px at 50% 0%, rgba(201,168,76,0.09) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(40,200,255,0.1) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="container-wide relative z-10 text-center">
        <span className="section-label">Photographs</span>
        <h2 id="photos-heading" className="section-title-white mb-4">
          Photographs from the Night
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Photographs from the evening are by Chris Vaughan Photography and are ready to
          download.
        </p>

        <div className="mt-8">
          <a
            href={GALLERY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-lg text-base px-12 py-5"
          >
            View &amp; Download the Photographs
          </a>
        </div>

        <p className="mt-7 text-gray-300 text-lg">
          Password:{' '}
          <span
            className="font-bold text-2xl md:text-3xl align-middle tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #dda03a, #c9a84c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            LMA26
          </span>
        </p>
      </div>
    </section>
  )
}
