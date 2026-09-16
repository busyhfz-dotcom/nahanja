import Link from "next/link";
import { CatalogItem, contentHref, getRelatedItems } from "../../lib/catalog";
import styles from "./content-page.module.css";
export function ContentPage({ item }: { item: CatalogItem }) {
  const related = getRelatedItems(item);
  return <main className={styles.page + " " + styles[item.accent]}>
    <nav className={styles.nav}><Link href="/" className={styles.brand}>نهان‌جا</Link><Link href="/" className={styles.back}>بازگشت به کشف‌ها ←</Link></nav>
    <section className={styles.hero}><div className={styles.orb} aria-hidden="true" /><p className={styles.eyebrow}>{item.eyebrow}</p><h1>{item.title}</h1><p className={styles.lede}>{item.description}</p><div className={styles.tags}>{item.feeling.map((tag) => <span key={tag}>{tag}</span>)}</div>{item.duration && <button className={styles.listen}><span>▶</span>{item.duration}</button>}</section>
    <section className={styles.body}><p className={styles.eyebrow}>ادامهٔ مسیر</p><h2>از اینجا، کجا برویم؟</h2><div className={styles.grid}>{related.map((relatedItem) => <Link href={contentHref(relatedItem)} key={relatedItem.slug} className={styles.card + " " + styles["card" + relatedItem.accent]}><small>{relatedItem.eyebrow}</small><strong>{relatedItem.title}</strong><span>کشف کن ←</span></Link>)}</div></section>
  </main>;
}
