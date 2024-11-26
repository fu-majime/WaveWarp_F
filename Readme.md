# WaveWarp_F
AviUtl拡張編集用、GPUを使用した波形ワープスクリプト

## 動作要件
- [GLShaderKit](https://github.com/karoterra/aviutl-GLShaderKit)
- [rikkymodule](https://hazumurhythm.com/wev/amazon/?script=rikkymodulea2Z) （無くても動く）

## パラメータ説明

### 高さ （トラックバー）
合成する波の振幅の大きさ
### 幅 （トラックバー）
合成する波の波長の大きさ
### 回転[°] （トラックバー）
合成する波の角度
### 周期[s] （トラックバー）
合成する波の周期
### 波形 （リスト）
合成する波の波形を変更できる
### 位相[°]
合成する波の位相
### 波形ミラー
合成されるものの波の形を上下で反転するか
### エッジ固定 （リスト）
合成されるものの端の表示を変更できる
### reload
シェーダーをリロードするか
### PI
トラックバーのパラメータインジェクション用