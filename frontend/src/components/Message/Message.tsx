const Message = ({ msg }: { msg: string }) => {
  const { TimeStamp, Username, Body } = JSON.parse(msg);
  const messageTimestamp = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
  }).format(TimeStamp);

  const isNotifyMessage =
    Body === "New User Joined..." || Body === "A User Left...";

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        {/* @TODO: Show random and persistent colors for a user */}
        <span className="font-medium text-[#24d1ac]">{Username}</span>
        <p className={`${isNotifyMessage ? "text-neutral-500" : "text-white"}`}>
          {Body}
        </p>
      </div>
      <span className="text-neutral-500">{messageTimestamp}</span>
    </div>
  );
};

export default Message;
