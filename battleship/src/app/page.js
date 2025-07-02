import styles from "./page.module.css";
import Field from "./components";

export default function Home() {
  return (
    <div className={styles.page}>
      <Field />
    </div>
  );
}
