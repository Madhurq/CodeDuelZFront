export default function ProfileCard({ profileData, onEditClick, onLogout }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-border rounded-xl p-8 h-fit shadow-md relative overflow-hidden group">
      {/* Background gradient effect */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-br from-primary to-secondary opacity-10 z-0"></div>

      <div className="w-[110px] h-[110px] rounded-xl flex items-center justify-center text-[3rem] shadow-[0_8px_24px_rgba(59,130,246,0.3)] bg-gradient-to-br from-primary to-secondary text-white relative z-10 mx-auto mb-6 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-[0_12px_32px_rgba(59,130,246,0.4)]">
        👨‍💻
      </div>
      <h2 className="text-xl font-bold text-center mb-2">{profileData.name}</h2>
      <p className="text-[0.9rem] text-center text-text-secondary mb-6">{profileData.email}</p>

      <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-border">
        {[
          { label: 'Wins', value: profileData.wins },
          { label: 'Losses', value: profileData.losses },
          { label: 'Rating', value: profileData.rating },
          { label: 'Rank', value: profileData.rank }
        ].map((stat) => (
          <div key={stat.label} className="flex justify-between">
            <span className="text-[0.9rem] text-text-secondary">{stat.label}</span>
            <span className="font-bold text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          className="w-full py-3.5 rounded-lg border-none font-bold text-[0.95rem] cursor-pointer transition-all relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] active:-translate-y-px"
          onClick={onEditClick}
        >
          Edit Profile
        </button>
        <button
          className="w-full py-3.5 rounded-lg border-2 border-border font-bold text-[0.95rem] cursor-pointer transition-all bg-surface text-text shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:bg-surface-alt hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
