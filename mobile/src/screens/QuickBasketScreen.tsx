import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';
import { ShoppingBag, Zap, CheckCircle2, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface BasketItem {
  id: string;
  name: string;
  packUnit: string;
  zeptoPrice: number;
  blinkitPrice: number;
  instamartPrice: number;
}

export const QuickBasketScreen: React.FC = () => {
  const [basket, setBasket] = useState<BasketItem[]>([
    {
      id: 'b1',
      name: 'Pink Dragon Fruit (Pitaya)',
      packUnit: '1 pc (350g)',
      zeptoPrice: 109,
      blinkitPrice: 105,
      instamartPrice: 115
    },
    {
      id: 'b2',
      name: 'Epigamia Greek Yogurt Plain',
      packUnit: '200g tub',
      zeptoPrice: 85,
      blinkitPrice: 80,
      instamartPrice: 85
    },
    {
      id: 'b3',
      name: 'Farm Fresh Brown Eggs',
      packUnit: 'Pack of 6',
      zeptoPrice: 44,
      blinkitPrice: 42,
      instamartPrice: 46
    },
    {
      id: 'b4',
      name: 'Crunchy Peanut Butter',
      packUnit: '500g jar',
      zeptoPrice: 175,
      blinkitPrice: 170,
      instamartPrice: 185
    }
  ]);

  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState<'Zepto' | 'Blinkit' | 'Instamart'>('Blinkit');
  const [orderDone, setOrderDone] = useState(false);

  const calculateTotals = () => {
    let zepto = 0;
    let blinkit = 0;
    let instamart = 0;

    basket.forEach((item) => {
      zepto += item.zeptoPrice;
      blinkit += item.blinkitPrice;
      instamart += item.instamartPrice;
    });

    const zeptoFee = zepto > 199 ? 0 : 15;
    const blinkitFee = blinkit > 199 ? 0 : 15;
    const instamartFee = instamart > 199 ? 0 : 20;

    const zTot = zepto + zeptoFee;
    const bTot = blinkit + blinkitFee;
    const iTot = instamart + instamartFee;
    const minTot = Math.min(zTot, bTot, iTot);
    const maxTot = Math.max(zTot, bTot, iTot);

    return {
      zepto: zTot,
      blinkit: bTot,
      instamart: iTot,
      savings: maxTot - minTot
    };
  };

  const totals = calculateTotals();

  const removeItem = (id: string) => {
    setBasket((prev) => prev.filter((i) => i.id !== id));
  };

  const loadPreset = (type: 'student' | 'hifi') => {
    if (type === 'student') {
      setBasket([
        {
          id: 'ps1',
          name: 'Saffola Masala Oats (Classic)',
          packUnit: '400g pack',
          zeptoPrice: 85,
          blinkitPrice: 82,
          instamartPrice: 88
        },
        {
          id: 'ps2',
          name: 'Farm Fresh Eggs',
          packUnit: 'Pack of 10',
          zeptoPrice: 72,
          blinkitPrice: 68,
          instamartPrice: 75
        },
        {
          id: 'ps3',
          name: 'Fortune Soya Chunks',
          packUnit: '200g box',
          zeptoPrice: 45,
          blinkitPrice: 42,
          instamartPrice: 48
        },
        {
          id: 'ps4',
          name: 'Thick Kanda Poha (Flattened Rice)',
          packUnit: '500g pouch',
          zeptoPrice: 45,
          blinkitPrice: 42,
          instamartPrice: 48
        }
      ]);
    } else {
      setBasket([
        {
          id: 'ph1',
          name: 'Pink Pitaya / Dragon Fruit',
          packUnit: '2 pcs (700g)',
          zeptoPrice: 218,
          blinkitPrice: 210,
          instamartPrice: 230
        },
        {
          id: 'ph2',
          name: 'Frozen Wild Blueberries',
          packUnit: '250g pack',
          zeptoPrice: 299,
          blinkitPrice: 289,
          instamartPrice: 310
        },
        {
          id: 'ph3',
          name: 'Imported Hass Avocado',
          packUnit: '2 pcs pack',
          zeptoPrice: 230,
          blinkitPrice: 220,
          instamartPrice: 245
        },
        {
          id: 'ph4',
          name: 'Artisanal Sourdough Loaf',
          packUnit: '400g sourdough',
          zeptoPrice: 140,
          blinkitPrice: 135,
          instamartPrice: 145
        }
      ]);
    }
  };

  const handlePlaceOrder = () => {
    setOrderDone(true);
    setTimeout(() => {
      setOrderDone(false);
      setCheckoutModalVisible(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title Header */}
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <ShoppingBag size={20} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Quick-Commerce Basket</Text>
          <Text style={styles.sub}>
            Real-time grocery comparison across Zepto, Blinkit & Swiggy Instamart
          </Text>
        </View>
      </View>

      {/* Preset Starters */}
      <View style={styles.presetSection}>
        <Text style={styles.sectionLabel}>QUICK PRESETS</Text>
        <View style={styles.presetRow}>
          <TouchableOpacity
            style={styles.presetBtnStudent}
            onPress={() => loadPreset('student')}
            activeOpacity={0.8}
          >
            <Text style={styles.presetEmoji}>💸</Text>
            <View>
              <Text style={styles.presetBtnStudentTitle}>Broke Student Pack</Text>
              <Text style={styles.presetBtnStudentSub}>Oats, Eggs, Soya & Poha</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetBtnHifi}
            onPress={() => loadPreset('hifi')}
            activeOpacity={0.8}
          >
            <Text style={styles.presetEmoji}>✨</Text>
            <View>
              <Text style={styles.presetBtnHifiTitle}>Hi-Fi Gourmet Pack</Text>
              <Text style={styles.presetBtnHifiSub}>Dragon Fruit, Açaí & Avocado</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Store Comparison Grid */}
      <Text style={styles.sectionLabel}>LIVE STORE PRICES</Text>
      <View style={styles.storesGrid}>
        {/* Zepto */}
        <TouchableOpacity
          style={[
            styles.storeCard,
            selectedStore === 'Zepto' && styles.selectedStore
          ]}
          onPress={() => setSelectedStore('Zepto')}
          activeOpacity={0.85}
        >
          <View style={[styles.storeBadge, { backgroundColor: '#FDF2F8' }]}>
            <Text style={[styles.storeBadgeText, { color: Colors.zepto }]}>⚡ 10 MIN</Text>
          </View>
          <Text style={[styles.storeTitle, { color: Colors.zepto }]}>Zepto</Text>
          <Text style={styles.storeTotal}>₹{totals.zepto}</Text>
          <TouchableOpacity
            style={[styles.storeOrderBtn, { backgroundColor: Colors.zepto }]}
            onPress={() => {
              setSelectedStore('Zepto');
              setCheckoutModalVisible(true);
            }}
          >
            <Text style={styles.storeOrderBtnText}>Order Zepto</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Blinkit */}
        <TouchableOpacity
          style={[
            styles.storeCard,
            styles.bestStoreCard,
            selectedStore === 'Blinkit' && styles.selectedStore
          ]}
          onPress={() => setSelectedStore('Blinkit')}
          activeOpacity={0.85}
        >
          <View style={styles.cheapestBadge}>
            <Text style={styles.cheapestText}>BEST VALUE</Text>
          </View>
          <View style={[styles.storeBadge, { backgroundColor: '#FEF3C7', marginTop: 4 }]}>
            <Text style={[styles.storeBadgeText, { color: '#B45309' }]}>🛒 12 MIN</Text>
          </View>
          <Text style={[styles.storeTitle, { color: '#B45309' }]}>Blinkit</Text>
          <Text style={styles.storeTotal}>₹{totals.blinkit}</Text>
          <TouchableOpacity
            style={[styles.storeOrderBtn, { backgroundColor: Colors.amber }]}
            onPress={() => {
              setSelectedStore('Blinkit');
              setCheckoutModalVisible(true);
            }}
          >
            <Text style={[styles.storeOrderBtnText, { color: '#1C1917' }]}>
              Order Blinkit
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Instamart */}
        <TouchableOpacity
          style={[
            styles.storeCard,
            selectedStore === 'Instamart' && styles.selectedStore
          ]}
          onPress={() => setSelectedStore('Instamart')}
          activeOpacity={0.85}
        >
          <View style={[styles.storeBadge, { backgroundColor: '#FFF7ED' }]}>
            <Text style={[styles.storeBadgeText, { color: Colors.instamart }]}>🌟 15 MIN</Text>
          </View>
          <Text style={[styles.storeTitle, { color: Colors.instamart }]}>Instamart</Text>
          <Text style={styles.storeTotal}>₹{totals.instamart}</Text>
          <TouchableOpacity
            style={[styles.storeOrderBtn, { backgroundColor: Colors.instamart }]}
            onPress={() => {
              setSelectedStore('Instamart');
              setCheckoutModalVisible(true);
            }}
          >
            <Text style={styles.storeOrderBtnText}>Order Swiggy</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Savings Banner */}
      {totals.savings > 0 && (
        <View style={styles.savingsBanner}>
          <View style={styles.savingsIconWrap}>
            <Zap size={14} color={Colors.emerald} />
          </View>
          <Text style={styles.savingsText}>
            Ordering via <Text style={{ fontWeight: '800', color: Colors.emerald }}>Blinkit</Text> saves you{' '}
            <Text style={{ fontWeight: '800', color: '#047857' }}>₹{totals.savings}</Text> compared to other instant grocery apps!
          </Text>
        </View>
      )}

      {/* Itemized Cart List */}
      <View style={styles.basketCard}>
        <View style={styles.basketCardHeader}>
          <Text style={styles.listHeading}>CART INGREDIENTS ({basket.length})</Text>
          <View style={styles.deliveryCityBadge}>
            <Text style={styles.deliveryCityText}>Bengaluru Koramangala</Text>
          </View>
        </View>

        {basket.map((item, idx) => (
          <View
            key={item.id}
            style={[
              styles.itemRow,
              idx === basket.length - 1 && { borderBottomWidth: 0 }
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPack}>{item.packUnit}</Text>
            </View>

            <View style={styles.itemPricesCol}>
              <View style={styles.pricePill}>
                <Text style={styles.pricePillLabel}>Z:</Text>
                <Text style={styles.itemZepto}>₹{item.zeptoPrice}</Text>
              </View>
              <View style={[styles.pricePill, styles.pricePillBest]}>
                <Text style={styles.pricePillLabel}>B:</Text>
                <Text style={styles.itemBlinkit}>₹{item.blinkitPrice}</Text>
              </View>
              <View style={styles.pricePill}>
                <Text style={styles.pricePillLabel}>I:</Text>
                <Text style={styles.itemInstamart}>₹{item.instamartPrice}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => removeItem(item.id)}
              style={styles.trashBtn}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Checkout Modal */}
      <Modal visible={checkoutModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!orderDone ? (
              <>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeaderRow}>
                  <View>
                    <Text style={styles.modalTitle}>Checkout on {selectedStore}</Text>
                    <Text style={styles.modalSub}>
                      Delivery in {selectedStore === 'Zepto' ? '10 mins' : selectedStore === 'Blinkit' ? '12 mins' : '15 mins'} to Koramangala
                    </Text>
                  </View>
                  <View style={[styles.checkoutStoreBadge, {
                    backgroundColor: selectedStore === 'Zepto' ? '#FDF2F8' : selectedStore === 'Blinkit' ? '#FEF3C7' : '#FFF7ED'
                  }]}>
                    <Text style={{
                      fontWeight: '800',
                      color: selectedStore === 'Zepto' ? Colors.zepto : selectedStore === 'Blinkit' ? '#B45309' : Colors.instamart
                    }}>
                      {selectedStore}
                    </Text>
                  </View>
                </View>

                {/* Bill Breakdown */}
                <View style={styles.billBox}>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Item Total ({basket.length} items)</Text>
                    <Text style={styles.billValue}>
                      ₹{selectedStore === 'Zepto' ? totals.zepto : selectedStore === 'Blinkit' ? totals.blinkit : totals.instamart}
                    </Text>
                  </View>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    <Text style={[styles.billValue, { color: Colors.emerald, fontWeight: '700' }]}>FREE</Text>
                  </View>
                  <View style={styles.billDivider} />
                  <View style={styles.billRow}>
                    <Text style={styles.billTotalLabel}>To Pay</Text>
                    <Text style={styles.billTotalValue}>
                      ₹{selectedStore === 'Zepto' ? totals.zepto : selectedStore === 'Blinkit' ? totals.blinkit : totals.instamart}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handlePlaceOrder}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmBtnText}>Confirm Instant Dispatch 🚀</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setCheckoutModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Back to Cart</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 28 }}>
                <View style={styles.successIconCircle}>
                  <CheckCircle2 size={44} color={Colors.emerald} />
                </View>
                <Text style={styles.modalTitle}>Order Dispatched!</Text>
                <Text style={styles.modalSub}>
                  Rider assigned from {selectedStore} dark store. Arriving in 10-12 minutes.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  sub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4
  },
  presetSection: {
    marginBottom: 16
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10
  },
  presetBtnStudent: {
    flex: 1,
    backgroundColor: Colors.emeraldLight,
    borderWidth: 1.5,
    borderColor: Colors.emeraldBorder,
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  presetEmoji: {
    fontSize: 22
  },
  presetBtnStudentTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46'
  },
  presetBtnStudentSub: {
    fontSize: 10,
    color: '#047857',
    marginTop: 1
  },
  presetBtnHifi: {
    flex: 1,
    backgroundColor: Colors.purpleLight,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  presetBtnHifiTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5B21B6'
  },
  presetBtnHifiSub: {
    fontSize: 10,
    color: '#6D28D9',
    marginTop: 1
  },
  storesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  storeCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Colors.shadow
  },
  bestStoreCard: {
    borderColor: Colors.emerald,
    backgroundColor: '#F0FDF4'
  },
  selectedStore: {
    borderColor: Colors.primary,
    borderWidth: 2
  },
  cheapestBadge: {
    position: 'absolute',
    top: -9,
    backgroundColor: Colors.emerald,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  cheapestText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5
  },
  storeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6
  },
  storeBadgeText: {
    fontSize: 9,
    fontWeight: '800'
  },
  storeTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  storeTotal: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 4,
    marginBottom: 10
  },
  storeOrderBtn: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  storeOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.emeraldLight,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    gap: 8,
    marginBottom: 16
  },
  savingsIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  savingsText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1,
    lineHeight: 17
  },
  basketCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow
  },
  basketCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  listHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8
  },
  deliveryCityBadge: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  deliveryCityText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  itemPack: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2
  },
  itemPricesCol: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 10
  },
  pricePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 2
  },
  pricePillBest: {
    backgroundColor: Colors.amberLight
  },
  pricePillLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textSecondary
  },
  itemZepto: {
    fontSize: 10,
    color: Colors.zepto,
    fontWeight: '700'
  },
  itemBlinkit: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: '800'
  },
  itemInstamart: {
    fontSize: 10,
    color: Colors.instamart,
    fontWeight: '700'
  },
  trashBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  modalSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3
  },
  checkoutStoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  billBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  billLabel: {
    fontSize: 13,
    color: Colors.textSecondary
  },
  billValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  billDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8
  },
  billTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    ...Colors.shadow
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600'
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.emeraldLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  }
});
