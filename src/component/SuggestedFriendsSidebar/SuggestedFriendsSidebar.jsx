// components/SuggestedFriendsSidebar.jsx
import { Avatar, Button, Skeleton } from "@nextui-org/react";
import { UserPlus, Users } from "lucide-react";

export default function SuggestedFriendsSidebar({ friends = [], isLoading = false, error = null }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-5 sticky top-20">
        <Skeleton className="h-8 w-3/4 rounded-lg mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded-lg" />
                <Skeleton className="h-3 w-24 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-red-600">
        <p>حدث خطأ أثناء تحميل الاقتراحات</p>
        <p className="text-sm mt-2">{error.message || "جرب مرة أخرى لاحقًا"}</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
        <Users size={40} className="mx-auto mb-3 opacity-50" />
        <p>لا يوجد اقتراحات أصدقاء حاليًا</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Suggested Friends</h3>
        <span className="text-sm text-gray-500">({friends.length})</span>
      </div>

      <div className="space-y-5">
        {friends.map((friend) => (
          <div key={friend._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar 
                src={friend.photo || "/default-avatar.png"} 
                size="md" 
                fallback={<Users size={20} />}
              />
              <div>
                <p className="font-medium text-sm">{friend.name}</p>
                <p className="text-xs text-gray-500">{friend.username}</p>
                {friend.followersCount !== undefined && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {friend.followersCount} followers
                  </p>
                )}
              </div>
            </div>

            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<UserPlus size={14} />}
              className="min-w-[80px]"
              // هنا ممكن تضيفي onPress لاحقًا للـ follow API
            >
              Follow
            </Button>
          </div>
        ))}
      </div>

      {friends.length > 5 && (
        <button className="text-blue-600 text-sm mt-4 hover:underline w-full text-center">
          عرض المزيد
        </button>
      )}
    </div>
  );
}