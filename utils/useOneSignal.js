import { useEffect } from "react";

const useOneSignal = () =>
  useEffect(() => {
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.init({
        appId: "b290f6c5-b6dc-48b9-9170-4cb83cf240e2",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
        persistNotification: true,
      });
    });

    return () => {
      window.OneSignal = undefined;
    };
  }, []); // <-- run this effect once on mount

export default useOneSignal;
