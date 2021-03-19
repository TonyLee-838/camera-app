from annoy import AnnoyIndex
import sys

# 将nodejs传递过来的参数转化为数组
features=sys.argv[1]
features=features.split(',')
features=[ float(x) for x in features ]

k=5
dimensions=500
indexPath = "./data/index.ann"

annIndex=AnnoyIndex(dimensions, 'angular')
annIndex.load(indexPath)
result=annIndex.get_nns_by_vector(features,k,search_k=-1)
#返回结果给nodejs
print(result)