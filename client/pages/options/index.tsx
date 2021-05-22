import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/options/options.module.css";
import { Avatar } from "../../components/Avatar/Avatar";
import { Button } from "../../components/Button/Button";

export default function OptionsPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <section className={styles.settingsListContainer}>
        <ul className={styles.settingsList}>
          <li className={styles.settingsListItem}>My Account</li>
          <li className={styles.settingsListItem}>Servers</li>
          <li className={styles.settingsListItem}>Log Out</li>
        </ul>
      </section>
      <main className={styles.currentSettingContainer}>
        <div className={styles.currentSetting}>
          <div className={styles.topRow}>
            <h1>My Account</h1>
            <button className={styles.goBackBtn} onClick={() => router.back()}>
              Go back
            </button>
          </div>
          <div className={styles.userInfoContainer}>
            <div className={styles.userInfo}>
              <div>
                <Avatar>U</Avatar>
                <p>Username</p>
              </div>
              <button>...</button>
            </div>
            <ul className={styles.userInfoSettingsList}>
              <li className={styles.userInfoSettingsListItem}>
                <div>
                  <h2 className={styles.label}>USERNAME</h2>
                  <h1>Foobar</h1>
                </div>
                <Button>Edit</Button>
              </li>
              <li className={styles.userInfoSettingsListItem}>
                <div>
                  <h2 className={styles.label}>EMAIL</h2>
                  <h1>foo@bar.com</h1>
                </div>
                <Button>Edit</Button>
              </li>
            </ul>
          </div>
          <div className={styles.authenticationSettings}>
            <h1>Password and Authentication</h1>
            <Button>Change Password</Button>
          </div>
          <div className={styles.accountRemoval}>
            <h1>ACCOUNT REMOVAL</h1>
            <p>After this action your account will be permanently deleted</p>
            <Button>Delete Account</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
