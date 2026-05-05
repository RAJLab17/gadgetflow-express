import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { BLOG_ARTICLES } from "@/content/site-urls";

const GOLD = "#9b6b3f";
const GOLD_SOFT = "#c8946b";

const BrandJournal = () => {
  const articles = [...BLOG_ARTICLES]
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
    .slice(0, 4);

  return (
    <section
      className="relative py-32 md:py-44 overflow-hidden"
      style={{ background: "#fafaf7" }}
    >
      <div className="container mx-auto px-6 sm:px-10 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[10px] font-light uppercase mb-6"
              style={{ color: GOLD, letterSpacing: "0.5em" }}
            >
              — Journal
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-extralight leading-[1] tracking-[-0.02em] max-w-2xl"
              style={{ color: "#1a1612" }}
            >
              News, ideas,
              <br />
              <span className="italic" style={{ color: GOLD }}>
                quiet thoughts.
              </span>
            </motion.h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[11px] font-medium uppercase group self-start md:self-end"
            style={{ color: "#1a1612", letterSpacing: "0.3em" }}
          >
            All entries
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1612]/10 border-y border-[#1a1612]/10">
          {articles.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#fafaf7]"
            >
              <Link
                to={a.path}
                className="group block p-10 md:p-12 h-full transition-colors duration-500 hover:bg-white"
              >
                <div className="flex items-center gap-4 mb-8">
                  <span
                    className="text-[10px] font-light uppercase"
                    style={{ color: GOLD, letterSpacing: "0.4em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 h-px bg-[#1a1612]/10" />
                  <time
                    className="text-[10px] font-light uppercase"
                    style={{ color: "#3a3128", letterSpacing: "0.3em" }}
                    dateTime={a.dateISO}
                  >
                    {a.date}
                  </time>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-extralight leading-tight mb-5 transition-colors duration-300"
                  style={{ color: "#1a1612", letterSpacing: "-0.01em" }}
                >
                  {a.title}
                </h3>
                <p
                  className="text-sm md:text-base font-light leading-relaxed mb-8"
                  style={{ color: "#3a3128" }}
                >
                  {a.excerpt}
                </p>
                <span
                  className="inline-flex items-center gap-2 text-[11px] font-medium uppercase"
                  style={{ color: GOLD, letterSpacing: "0.3em" }}
                >
                  Read
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandJournal;
