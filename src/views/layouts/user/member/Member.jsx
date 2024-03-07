import { formatDate } from "~/utils/commonUtils";
import styles from "./Member.module.css";

const Member = ({ user }) => {
    return (
        <div className={styles.member}>
            <div className={styles['member-avatar']}>
                <img src="/assets/images/avatar/member-avatar.png" alt="member-avatar" />
            </div>
            <div className={styles['member-info']}>
                <p className={styles['member-welcome']}><span>Xin chào</span> <span className={styles['member-name']}>{user ? user.username : ""}</span>!</p>
                <ul className={styles['member-info-list']}>
                    <li className={styles['member-info-item']}>
                        <p className={styles['member-info-item-title']}>Ngày tham gia</p>
                        <img src="/assets/icons/member/joining-date.svg" alt="joining-date" />
                        <p><strong>{formatDate(user ? user.registrationDate : "")}</strong></p>
                    </li>
                    <li className={styles['member-info-item']}>
                        <p className={styles['member-info-item-title']}>Hạng thành viên</p>
                        <img src="/assets/icons/member/membership.svg" alt="membership" />
                        <p><strong>{user ? user.membershipLevel : ""}</strong></p>
                    </li>
                    <li className={styles['member-info-item']}>
                        <p className={styles['member-info-item-title']}>Điểm tích lũy</p>
                        <img src="/assets/icons/member/accumulated-points.svg" alt="accumulated points" />
                        <p><strong>{user ? user.accumulatedPoints : ""}</strong></p>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Member;