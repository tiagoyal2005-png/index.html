import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroSaree from "@/assets/hero-saree.jpg";
import { collections, craftJourney, images, journalPosts, products, reviews } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { StarRating } from "@/components/StarRating";
import { Reveal } from "@/components/Reveal";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kota Doria — Handwoven Sarees & Suits from Kota, Rajasthan" },
      {
        name: "description",
        content:
          "Handwoven Kota Doria sarees and suit sets made by artisans of Kota, Rajasthan. Traditional khat weave, real zari, and a heritage textile house you can buy from directly.",
      },
      { property: "og:title", content: "Kota Doria — Handwoven Sarees & Suits from Rajasthan" },
      {
        property: "og:description",
        content:
          "A heritage textile house working with artisans of Kota to weave sarees and suits for modern life.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const featuredJournal = journalPosts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[78vh] w-full overflow-hidden md:min-h-[88vh]">
        <img
          src={heroSaree}
          alt="Woman wearing a cream Kota Doria saree with a maroon border in a sunlit Rajasthani courtyard"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/70 to-transparent" />
        <div className="container-page relative flex min-h-[78vh] items-center py-20 md:min-h-[88vh]">
          <div className="max-w-xl">
            <p className="eyebrow">Handwoven in Kota, Rajasthan</p>
            <h1 className="display mt-6 text-[2.75rem] sm:text-6xl lg:text-7xl">
              The weave of Kota,
              <br />
              woven by hand
            </h1>
            <p className="mt-7 max-w-md text-base text-muted-foreground">
              Sarees and suit sets in traditional Kota Doria — light enough for daily
              wear, considered enough for the evenings that matter.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-primary px-10 py-4 text-xs uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Shop Kota Doria
              </Link>
              <Link
                to="/heritage"
                className="inline-flex items-center justify-center border border-foreground/25 px-10 py-4 text-xs uppercase tracking-[0.22em] transition-colors hover:border-foreground"
              >
                Discover our heritage

              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container-page section-y" aria-labelledby="bestsellers">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Most worn</p>
            <h2 id="bestsellers" className="display mt-4 text-4xl md:text-5xl">
              Bestsellers
            </h2>

          </div>
          <Link to="/shop" className="link-underline text-xs uppercase tracking-[0.2em]">
            View all
          </Link>
        </Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((product, i) => (
            <Reveal key={product.slug} delay={i * 90}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Heritage story — alternating */}
      <section aria-labelledby="heritage-story" className="border-t border-border">
        <h2 id="heritage-story" className="sr-only">
          The heritage of Kota Doria
        </h2>
        <StoryRow
          image={images.craftWeaveDetail}
          alt="Macro detail of the square khat weave with gold zari thread"
          eyebrow="The weave"
          title="Fourteen threads make one square"
          body="Kota Doria is defined by its khat — eight cotton threads and six of silk, repeated across six metres of fabric. Hold it to the light and the squares drift a fraction. That drift is the hand."
          to="/craft"
          cta="See the process"
        />
        <StoryRow
          reverse
          image={images.craftLoom}
          alt="A weaver's hands working fine thread on a wooden pit loom"
          eyebrow="The weavers"
          title="Bought from the loom, not the market"
          body="We work directly with weaving households in Kota rather than through traders, and we agree the rate per saree before the warp is laid."
          to="/heritage"
          cta="Our heritage"
        />
        <StoryRow
          image={images.heritageVillage}
          alt="Wooden looms and hanging dyed thread in a Kota workshop"
          eyebrow="Now"
          title="An old weave, reinterpreted"
          body="Widened pallu bands, muted grounds, gold reduced to a hairline. The technique is unchanged; the proportion is not."
          to="/collections"
          cta="Browse collections"
        />
      </section>

      {/* Craft journey */}
      <section className="border-t border-border bg-card" aria-labelledby="journey">
        <div className="container-page section-y-tight">
          <Reveal>
            <p className="eyebrow">Thread → Weave → Craft → Finish → You</p>
            <h2 id="journey" className="display mt-4 max-w-2xl text-4xl md:text-5xl">
              How a saree reaches you
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {craftJourney.map((stage, i) => (
              <Reveal as="li" key={stage.step} delay={i * 80}>
                <div className="hover-zoom aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={stage.image}
                    alt={stage.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} · {stage.step}
                </p>
                <h3 className="mt-2 font-serif text-xl font-light">{stage.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{stage.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Collections */}
      <section className="container-page section-y" aria-labelledby="collections-home">
        <Reveal>
          <p className="eyebrow">Five lines</p>
          <h2 id="collections-home" className="display mt-4 text-4xl md:text-5xl">
            The collections
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {collections.slice(0, 3).map((collection, i) => (
            <Reveal key={collection.slug} delay={i * 90}>
              <Link
                to="/collections/$slug"
                params={{ slug: collection.slug }}
                className="hover-zoom group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={collection.image}
                    alt={collection.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-6 font-serif text-2xl font-light">{collection.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {collection.subtitle}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Kota Doria suits */}
      <section className="grid border-t border-border bg-card lg:grid-cols-2" aria-labelledby="suits-home">
        <div className="hover-zoom aspect-[4/5] overflow-hidden bg-muted lg:aspect-auto">
          <img
            src={images.suitIvory}
            alt="Woman wearing an ivory handwoven Kota Doria suit set with a thin maroon border"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center px-5 py-16 md:px-16">
          <Reveal className="max-w-md">
            <p className="eyebrow">New category</p>
            <h2 id="suits-home" className="display mt-4 text-4xl md:text-5xl">
              Kota Doria suits
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Kurta, straight pants and dupatta lifted from a single warp, so the three
              pieces read as one cloth. The same khat weave as our sarees, cut for days
              that do not stop.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/suits"
                className="inline-flex items-center justify-center bg-primary px-9 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Shop suits
              </Link>
              <Link
                to="/shop"
                search={{ filter: "new", q: undefined, category: undefined }}
                className="inline-flex items-center justify-center border border-foreground/25 px-9 py-3.5 text-xs uppercase tracking-[0.2em] transition-colors hover:border-foreground"
              >
                New arrivals
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Artisans of Kota */}
      <section className="border-t border-border" aria-labelledby="artisans">
        <div className="container-page section-y">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Artisans of Kota</p>
            <h2 id="artisans" className="display mt-4 text-4xl md:text-5xl">
              The hands behind the khat
            </h2>
            <p className="mt-7 text-base leading-relaxed text-muted-foreground">
              Every piece here is woven by artisan households in and around Kota,
              Rajasthan. We buy directly from the loom and agree the rate per piece
              before the warp is laid, so the price you pay reaches the people who
              made the cloth.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Bought at the loom",
                body: "No trader in between. Rates are agreed in advance and paid on completion.",
              },
              {
                title: "Woven, not printed",
                body: "Borders, buti and pallu bands are worked into the cloth at the loom.",
              },
              {
                title: "Small runs",
                body: "Batches are limited by what a household can weave in a season, not by demand.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <span className="block h-px w-12 bg-gold" aria-hidden="true" />
                <h3 className="mt-6 font-serif text-2xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            ))}
          </div>
          <Link
            to="/heritage"
            className="link-underline mt-12 inline-block text-xs uppercase tracking-[0.2em]"
          >
            Read our heritage
          </Link>
        </div>
      </section>

      {/* Customer stories */}
      <section className="border-t border-border bg-card" aria-labelledby="stories">
        <div className="container-page section-y">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Customer stories</p>
            <h2 id="stories" className="display mt-4 text-4xl md:text-5xl">
              Worn, and written about
            </h2>
          </Reveal>
          {reviews.length === 0 ? (
            <Reveal className="mt-10 max-w-2xl">
              <p className="text-sm leading-relaxed text-muted-foreground">
                We publish reviews, customer photographs and video stories only from
                verified purchases, so this space stays empty until the first ones
                arrive. If you have bought from us, we would like to hear how the
                piece wears.
              </p>
              <Link
                to="/contact"
                className="link-underline mt-8 inline-block text-xs uppercase tracking-[0.2em]"
              >
                Share your story
              </Link>
            </Reveal>
          ) : (
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {reviews.slice(0, 3).map((review) => (
                <Reveal key={review.id}>
                  <StarRating rating={review.rating} />
                  <h3 className="mt-4 font-serif text-xl font-light">{review.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {review.author}
                    {review.verifiedPurchase ? " · Verified purchase" : ""}
                  </p>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Editorial statement */}

      <section className="border-y border-border bg-card">
        <div className="container-page section-y text-center">
          <Reveal>
            <p className="mx-auto max-w-3xl font-serif text-3xl font-light leading-snug md:text-[2.6rem]">
              &ldquo;We are not preserving a craft. We are paying for it properly,
              which is the only thing that has ever preserved one.&rdquo;
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              The Kota Doria studio, Kota
            </p>
          </Reveal>
        </div>
      </section>

      {/* Journal */}
      <section className="container-page section-y" aria-labelledby="journal-home">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Journal</p>
            <h2 id="journal-home" className="display mt-4 text-4xl md:text-5xl">
              Notes from the loom
            </h2>
          </div>
          <Link to="/journal" className="link-underline text-xs uppercase tracking-[0.2em]">
            All stories
          </Link>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {featuredJournal.map((post, i) => (
            <Reveal key={post.slug} delay={i * 90}>
              <Link
                to="/journal/$slug"
                params={{ slug: post.slug }}
                className="hover-zoom block"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {post.category}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-light">{post.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border">
        <div className="container-page section-y text-center">
          <Reveal>
            <h2 className="display mx-auto max-w-2xl text-4xl md:text-5xl">
              Find the piece you will keep
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-sm text-muted-foreground">
              Every piece is handwoven in limited numbers. When a weave sells out,
              it takes weeks to return.
            </p>
            <Link
              to="/shop"
              className="mt-10 inline-flex items-center gap-3 bg-primary px-12 py-4 text-xs uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Shop Kota Doria
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function StoryRow({
  image,
  alt,
  eyebrow,
  title,
  body,
  to,
  cta,
  reverse = false,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
  to: "/craft" | "/heritage" | "/collections";
  cta: string;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-stretch md:grid-cols-2">
      <div className={`hover-zoom aspect-[4/3] overflow-hidden bg-muted md:aspect-auto md:min-h-[32rem] ${reverse ? "md:order-2" : ""}`}>
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center px-5 py-16 md:px-16">
        <Reveal className="max-w-md">
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="display mt-4 text-3xl md:text-4xl">{title}</h3>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{body}</p>
          <Link
            to={to}
            className="link-underline mt-8 inline-block text-xs uppercase tracking-[0.2em]"
          >
            {cta}
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
