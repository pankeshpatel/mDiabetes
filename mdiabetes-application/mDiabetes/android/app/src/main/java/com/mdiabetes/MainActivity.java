package com.mdiabetes;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.rnfs.RNFSPackage;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
    mReactRootView = new ReactRootView(this);

    mReactInstanceManager = ReactInstanceManager.builder()
      .setApplication(getApplication())
      .setBundleAssetName("com.aiisc.mdiabetes")
      .setJSMainModuleName("com.aiisc")
      .addPackage(new MainReactPackage())
      .addPackage(new RNFSPackage())
      .setUseDeveloperSupport(BuildConfig.DEBUG)
      .setInitialLifecycleState(LifecycleState.RESUMED)
      .build();

    mReactRootView.startReactApplication(mReactInstanceManager, "mDiabetes", null);

    setContentView(mReactRootView);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "mDiabetes";
  }
}
