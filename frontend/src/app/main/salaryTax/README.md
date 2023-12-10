## パフォーマンスがかなり気になるので、以下を検討。

- `react-virtualized`
- `react-window`

どちらもReactで仮想化リストを実現するためのもの。

### パッケージのサイズ

- react-windowはサイズが小さく依存関係が少ない。
- react-virtualizedは多くの機能を提供しているため、サイズが大きい。

### APIの差異

- react-window は、FixedSizeList や VariableSizeList など、一部の主要な仮想リストコンポーネントが提供されています。これらのコンポーネントは、アイテムの高さが固定か可変かによって選択できます。
- react-virtualized は、仮想化されたリストやグリッドの他にも、AutoSizer や InfiniteLoader など、様々な関連コンポーネントを提供しています。これにより、さまざまな使用ケースに対応できます。

### レンダリングパフォーマンス

- react-window は、レンダリングパフォーマンスに焦点を当てて設計されています。最小限のDOMノードしか作成せず、スクロールパフォーマンスを最大化することが目標です。
- react-virtualized も高パフォーマンスですが、react-window がよりシンプルで効率的なアーキテクチャを持っています。

とりあえずreact-windowを採用。
