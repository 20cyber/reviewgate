export function AuthPhoneTap() {
  return (
    <div className="rg-tap-scene" aria-hidden="true">
      <div className="rg-phone-tap">
        <span className="rg-nfc">
          <i />
          <i />
          <i />
        </span>
        <div className="rg-phone-body">
          <div className="rg-phone-screen">
            <span className="rg-phone-notch" />
            <span className="rg-phone-star">★</span>
          </div>
        </div>
        <span className="rg-tap-ripple" />
        <span className="rg-tap-ripple rg-tap-ripple-2" />
        <span className="rg-tap-finger" />
      </div>
    </div>
  );
}
