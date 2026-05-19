
import {useAppSelector} from "../../store";
import PageBreadcrumb from "../../admin/components/common/PageBreadCrumb.tsx";
import UserMetaCard from "../../admin/components/UserProfile/UserMetaCard.tsx";
import UserInfoCard from "../../admin/components/UserProfile/UserInfoCard.tsx";



export default function ProfilePage() {
    const user =
        useAppSelector(redux => redux.auth.user);

    console.log(user);
    return(
        <div>
            <PageBreadcrumb pageTitle="Profile" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Profile
                </h3>
                <div className="space-y-6">
                    <UserMetaCard />
                    <UserInfoCard />
                </div>
            </div>
        </div>
    );
}
