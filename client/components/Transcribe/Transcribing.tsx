
const Transcribing = () => {
  return (
    <div className="bg-card p-5 rounded-xl mt-5 space-y-4">
      <div>
        <h2 className="font-semibold text-sm">
          We're working on transcribing it now!
        </h2>
      </div>
      <div className="flex flex-col gap-1 ">
        <div className="flex justify-between itesm-center text-sm">
          <p className="text-muted-foreground">
            This usually takes a moment for longer audio...
          </p>
          <p>{10}%</p>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{
              width: `${10}%`,
            }}
          />
        </div>
      </div>
      <div className="text-sm">
        <p>We'll also email you a link to your transcript once it's ready.</p>
      </div>
    </div>
  );
};

export default Transcribing;
