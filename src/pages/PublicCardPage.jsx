import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import TextArea from '../components/TextArea'
import RadioGroup from '../components/RadioGroup'
import PhotoUpload from '../components/PhotoUpload'
import {
  getOwnerByLinkId,
  getVisitorRecord,
  submitVisitorInfo,
  getVisitorId,
  copyToClipboard,
} from '../lib/utils'

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
]

export default function PublicCardPage() {
  const { linkId } = useParams()
  const [loading, setLoading] = useState(true)
  const [owner, setOwner] = useState(null)
  const [visitorRecord, setVisitorRecord] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [wechat, setWechat] = useState('')
  const [bio, setBio] = useState('')
  const [expectation, setExpectation] = useState('')
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    loadData()
  }, [linkId])

  const loadData = async () => {
    setLoading(true)
    const ownerData = await getOwnerByLinkId(linkId)
    setOwner(ownerData)

    if (ownerData) {
      const visitorId = getVisitorId()
      const visitor = await getVisitorRecord(ownerData.id, visitorId)
      setVisitorRecord(visitor)
    }

    setLoading(false)
  }

  const validateForm = () => {
    if (!nickname.trim()) {
      alert('请输入你的昵称')
      return false
    }
    if (!gender) {
      alert('请选择性别')
      return false
    }
    if (!wechat.trim()) {
      alert('请输入微信号')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm() || !owner) return

    setSubmitting(true)
    try {
      const visitorId = getVisitorId()
      const visitorData = {
        owner_id: owner.id,
        visitor_id: visitorId,
        nickname: nickname.trim(),
        gender,
        wechat: wechat.trim(),
        bio: bio.trim(),
        expectation: expectation.trim(),
        photos,
        status: 'pending',
      }

      const result = await submitVisitorInfo(visitorData)
      if (result) {
        setVisitorRecord(result)
        setShowModal(false)
        alert('提交成功！请等待主人审核通过~')
      } else {
        alert('提交失败，请重试')
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyWechat = async () => {
    if (owner?.wechat) {
      await copyToClipboard(owner.wechat)
      alert('微信号已复制')
    }
  }

  const isApproved = visitorRecord?.status === 'approved'
  const isPending = visitorRecord?.status === 'pending'
  const isRevoked = visitorRecord?.status === 'revoked'

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <p className="text-text-muted">加载中...</p>
      </div>
    )
  }

  if (!owner) {
    return (
      <div className="page-container min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-6 opacity-30">🔍</div>
        <h2 className="text-lg font-semibold mb-2">页面不存在</h2>
        <p className="text-sm text-text-muted text-center">
          该链接无效或已被删除
        </p>
      </div>
    )
  }

  if (owner.link_status === 'closed') {
    return (
      <div className="page-container min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-6 opacity-30">🔒</div>
        <h2 className="text-lg font-semibold mb-2">链接已关闭</h2>
        <p className="text-sm text-text-muted text-center">
          主人已关闭此链接，暂时无法访问
        </p>
      </div>
    )
  }

  return (
    <div className="page-container min-h-screen bg-white pb-safe">
      <NavBar title="交友卡片" showBack={false} />

      <div className="text-center py-8 bg-gradient-to-b from-primary-50 to-white">
        <div className="w-22 h-22 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-4xl text-white shadow-avatar" style={{ width: '88px', height: '88px' }}>
          {isApproved ? '😊' : '👤'}
        </div>
        <h1 className="text-xl font-bold text-text mb-2">
          {isApproved ? owner.nickname : '—— 已锁定 ——'}
        </h1>
        <span className="inline-block text-xs text-primary-500 bg-primary-50 px-3 py-1 rounded-full">
          {owner.gender === 'male' ? '♂ 男' : owner.gender === 'female' ? '♀ 女' : '其他'}
        </span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {isApproved && owner.wechat && (
          <Card className="p-4">
            <div className="text-xs text-text-muted mb-2">微信号</div>
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-primary-500 bg-white px-4 py-2 rounded-full border border-primary-100 font-mono">
                {owner.wechat}
              </span>
              <Button size="small" variant="primary" onClick={handleCopyWechat}>
                复制
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-4">
          <div className="text-xs text-text-muted mb-2">自我介绍</div>
          <p className="text-sm text-text leading-relaxed">
            {owner.bio || '这个人很懒，什么都没留下~'}
          </p>
        </Card>

        <Card className="p-4">
          <div className="text-xs text-text-muted mb-2">交友期许</div>
          <p className="text-sm text-text leading-relaxed">
            {owner.expectation || '暂无'}
          </p>
        </Card>

        {owner.photos && owner.photos.length > 0 && (
          <Card className="p-4">
            <div className="text-xs text-text-muted mb-3">个人照片</div>
            {isApproved ? (
              <div className="grid grid-cols-3 gap-2">
                {owner.photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`照片${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center gap-2">
                {[0, 1, 2].slice(0, owner.photos.length).map((i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-lg bg-surface-hover flex items-center justify-center text-xl text-text-light"
                  >
                    🔒
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {!isApproved && (
        <div className="px-5 py-6">
          <Card className="p-6 text-center">
            {isPending ? (
              <>
                <div className="inline-block px-5 py-2 bg-status-pending-bg text-status-pending-text rounded-full text-sm font-medium mb-4">
                  ⏳ 待主人审核通过后即可查看完整资料
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  你的信息已提交，请耐心等待主人审核~
                </p>
              </>
            ) : isRevoked ? (
              <>
                <div className="text-4xl mb-4">😢</div>
                <p className="text-sm text-text mb-4">
                  主人撤销了你的查看权限
                </p>
                <Button variant="outline" block onClick={() => setShowModal(true)}>
                  重新申请
                </Button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🔒</div>
                <p className="text-sm text-text-muted mb-5 leading-relaxed">
                  昵称、微信号、个人照片已锁定<br />
                  填写你的信息互换并等待主人同意<br />
                  才可查看完整资料
                </p>
                <Button block onClick={() => setShowModal(true)}>
                  填 写 信 息 互 换
                </Button>
              </>
            )}
          </Card>
        </div>
      )}

      <div className="px-5 pb-8">
        <p className="text-xs text-text-light text-center leading-relaxed">
          以上信息仅用于交友互换，严格保密
        </p>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="填写信息互换"
      >
        <Input
          label="你的昵称"
          required
          placeholder="请输入你的昵称"
          value={nickname}
          onChange={setNickname}
        />
        <RadioGroup
          label="性别"
          required
          options={genderOptions}
          value={gender}
          onChange={setGender}
        />
        <Input
          label="微信号"
          required
          placeholder="请输入你的微信号"
          value={wechat}
          onChange={setWechat}
        />
        <TextArea
          label="自我介绍"
          placeholder="简单介绍一下自己吧"
          value={bio}
          onChange={setBio}
          rows={3}
        />
        <TextArea
          label="交友期许"
          placeholder="你期待什么样的朋友？"
          value={expectation}
          onChange={setExpectation}
          rows={3}
        />
        <div className="mb-5">
          <label className="block mb-2 text-text">
            个人照片（最多3张）
          </label>
          <PhotoUpload
            photos={photos}
            onChange={setPhotos}
            maxPhotos={3}
            ownerId={`visitor_${getVisitorId()}`}
          />
        </div>
        <div className="text-xs text-text-muted mb-4 leading-relaxed">
          提交后主人会看到你的信息，审核通过后你才能看到主人的完整资料哦~
        </div>
        <Button block onClick={handleSubmit} disabled={submitting}>
          {submitting ? '提交中...' : '提 交 申 请'}
        </Button>
      </Modal>
    </div>
  )
}
