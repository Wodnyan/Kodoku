import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/options/options.module.css";
import { Avatar } from "../../components/Avatar/Avatar";
import { Button } from "../../components/Button/Button";
import { Popup } from "../../components/Popup/Popup";
import { Input } from "../../components/Input/Input";

enum PopupOptions {
  ChangeUsername = 1,
  ChangeEmail,
  ChangePassword,
  DeleteAccount,
  ChangeAvatar,
}

export default function OptionsPage() {
  const router = useRouter();

  const [popup, setPopup] = useState<PopupOptions | null>(null);

  let popupBody = null;

  switch (popup) {
    case PopupOptions.ChangeUsername:
      popupBody = (
        <div>
          <h1>Change username</h1>
          <form>
            <Input full placeholder="New username" />
            <Input full placeholder="Password" />
            <Button full>Change</Button>
          </form>
        </div>
      );
      break;
    case PopupOptions.ChangeEmail:
      popupBody = (
        <div>
          <h1>Change email</h1>
          <form>
            <Input full placeholder="New email" />
            <Input full placeholder="Password" />
            <Button full>Change</Button>
          </form>
        </div>
      );
      break;
    case PopupOptions.ChangePassword:
      popupBody = (
        <div>
          <h1>Change password</h1>
          <form>
            <Input full placeholder="New password" />
            <Input full placeholder="Old password" />
            <Button full>Change</Button>
          </form>
        </div>
      );
      break;
    case PopupOptions.DeleteAccount:
      popupBody = (
        <form>
          <Button full>Are your sure?</Button>
        </form>
      );
      break;
    case PopupOptions.ChangeAvatar:
      popupBody = (
        <form>
          <Input type="file" />
          <Button full>Change</Button>
        </form>
      );
      break;
  }

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
        {popup && <Popup closeFn={() => setPopup(null)}>{popupBody}</Popup>}
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
              <button onClick={() => setPopup(PopupOptions.ChangeAvatar)}>
                ...
              </button>
            </div>
            <ul className={styles.userInfoSettingsList}>
              <li className={styles.userInfoSettingsListItem}>
                <div>
                  <h2 className={styles.label}>USERNAME</h2>
                  <h1>Foobar</h1>
                </div>
                <Button onClick={() => setPopup(PopupOptions.ChangeUsername)}>
                  Edit
                </Button>
              </li>
              <li className={styles.userInfoSettingsListItem}>
                <div>
                  <h2 className={styles.label}>EMAIL</h2>
                  <h1>foo@bar.com</h1>
                </div>
                <Button onClick={() => setPopup(PopupOptions.ChangeEmail)}>
                  Edit
                </Button>
              </li>
            </ul>
          </div>
          <div className={styles.authenticationSettings}>
            <h1>Password and Authentication</h1>
            <Button onClick={() => setPopup(PopupOptions.ChangePassword)}>
              Change Password
            </Button>
          </div>
          <div className={styles.accountRemoval}>
            <h1>ACCOUNT REMOVAL</h1>
            <p>After this action your account will be permanently deleted</p>
            <Button onClick={() => setPopup(PopupOptions.DeleteAccount)}>
              Delete Account
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}