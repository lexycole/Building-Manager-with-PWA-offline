module.exports = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'ttf', 'map', 'mjs', 'wasm'],
    assetExts: ['glb', 'gltf', 'png', 'jpg', 'ttf', 'json', 'jpeg'],
  },
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
}