import Link from "next/link";
import TagsMenu from "../TagsMenu/TagsMenu";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import LogoutButton from "../LogoutButton/LogoutButton";
import css from "./Header.module.css";
import { getCurrentUser } from "../../lib/auth/getCurrentUser";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className={css.header}>
      <Link href="/" className={css.logo}>
        VocabBuilder
      </Link>

      <nav className={css.navigation}>
        {user && <TagsMenu />}

        {!user && <AuthNavigation />}

        {user && (
          <>
            <span>Hello, {user.name}</span>
            <LogoutButton />
          </>
        )}
      </nav>
    </header>
  );
}