import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { StoreComparison } from '../types';
import { Zap, ShoppingBag, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface QuickCommerceWidgetProps {
  comparison: StoreComparison;
}

export const QuickCommerceWidget: React.FC<QuickCommerceWidgetProps> = ({ comparison }) => {
  const [selectedStore, setSelectedStore] = useState<'zepto' | 'blinkit' | 'instamart'>(
    comparison.bestValueStore === 'Zepto'
      ? 'zepto'
      : comparison.bestValueStore === 'Swiggy Instamart'
      ? 'instamart'
      : 'blinkit'
  );

  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const { zepto, blinkit, instamart } = comparison.stores;
  const currentStoreData = comparison.stores[selectedStore];

  const handleSimulateOrder = () => {
    setOrderConfirmed(true);
    setTimeout(() => {
      setCheckoutModalVisible(false);
      setOrderConfirmed(false);
    }, 2200);
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleContainer}>
          <ShoppingBag size={18} color={Colors.primary} />
          <Text style={styles.title}>Live Quick-Commerce Comparison</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Real-Time</Text>
        </View>
      </View>

      <Text style={styles.subtext}>
        Instant 10-15 minute grocery delivery rates in your area:
      </Text>

      {/* 3 Store Option Cards */}
      <View style={styles.storesGrid}>
        {/* Zepto */}
        <TouchableOpacity
          style={[
            styles.storeCard,
            selectedStore === 'zepto' && styles.selectedCard,
            zepto.isCheapest && styles.cheapestCardBorder
          ]}
          onPress={() => setSelectedStore('zepto')}
          activeOpacity={0.8}
        >
          {zepto.isCheapest && (
            <View style={styles.cheapestBadge}>
              <Text style={styles.cheapestBadgeText}>LOWEST</Text>
            </View>
          )}
          <Text style={[styles.storeName, { color: Colors.zepto }]}>⚡ Zepto</Text>
          <Text style={styles.deliveryTime}>10 Mins</Text>
          <Text style={styles.priceTag}>₹{zepto.grandTotal}</Text>
          <Text style={styles.packNote}>Full packs</Text>
        </TouchableOpacity>

        {/* Blinkit */}
        <TouchableOpacity
          style={[
            styles.storeCard,
            selectedStore === 'blinkit' && styles.selectedCard,
            blinkit.isCheapest && styles.cheapestCardBorder
          ]}
          onPress={() => setSelectedStore('blinkit')}
          activeOpacity={0.8}
        >
          {blinkit.isCheapest && (
            <View style={styles.cheapestBadge}>
              <Text style={styles.cheapestBadgeText}>LOWEST</Text>
            </View>
          )}
          <Text style={[styles.storeName, { color: '#B45309' }]}>🛒 Blinkit</Text>
          <Text style={styles.deliveryTime}>12 Mins</Text>
          <Text style={styles.priceTag}>₹{blinkit.grandTotal}</Text>
          <Text style={styles.packNote}>Full packs</Text>
        </TouchableOpacity>

        {/* Instamart */}
        <TouchableOpacity
          style={[
            styles.storeCard,
            selectedStore === 'instamart' && styles.selectedCard,
            instamart.isCheapest && styles.cheapestCardBorder
          ]}
          onPress={() => setSelectedStore('instamart')}
          activeOpacity={0.8}
        >
          {instamart.isCheapest && (
            <View style={styles.cheapestBadge}>
              <Text style={styles.cheapestBadgeText}>LOWEST</Text>
            </View>
          )}
          <Text style={[styles.storeName, { color: Colors.instamart }]}>🌟 Instamart</Text>
          <Text style={styles.deliveryTime}>15 Mins</Text>
          <Text style={styles.priceTag}>₹{instamart.grandTotal}</Text>
          <Text style={styles.packNote}>Full packs</Text>
        </TouchableOpacity>
      </View>

      {/* Savings Callout */}
      {comparison.maxSavingsAmount > 0 && (
        <View style={styles.savingsBanner}>
          <Zap size={14} color="#059669" />
          <Text style={styles.savingsText}>
            Ordering on <Text style={styles.savingsBold}>{comparison.bestValueStore}</Text> saves you{' '}
            <Text style={styles.savingsAmount}>₹{comparison.maxSavingsAmount}</Text> compared to other platforms!
          </Text>
        </View>
      )}

      {/* Portion Cost Explainer for Students */}
      <View style={styles.portionCostExplainer}>
        <Text style={styles.portionTitle}>💡 Student Reality Check:</Text>
        <Text style={styles.portionExplanation}>
          You buy full grocery packs for ₹{currentStoreData.totalPackCost}, but this single serving uses{' '}
          <Text style={styles.portionAmountHighlight}>₹{currentStoreData.totalPortionCost}</Text> of ingredients. Leftover items (dal, oil, rice, spices) remain for your next meals!
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => setCheckoutModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.actionBtnText}>
          Add Ingredients to {currentStoreData.name} (₹{currentStoreData.grandTotal})
        </Text>
        <ChevronRight size={18} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Checkout Modal */}
      <Modal
        visible={checkoutModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!orderConfirmed ? (
              <>
                <Text style={styles.modalTitle}>⚡ Instant Grocery Checkout</Text>
                <Text style={styles.modalSub}>
                  Ready to dispatch via {currentStoreData.name} dark store (ETA {currentStoreData.deliveryMinutes} mins)
                </Text>

                <ScrollView style={styles.itemsList}>
                  {comparison.ingredients.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemUnit}>
                          {item.fullPackUnit} (Uses {item.portionAmount})
                        </Text>
                      </View>
                      <Text style={styles.itemPrice}>
                        ₹
                        {selectedStore === 'zepto'
                          ? item.zepto
                          : selectedStore === 'blinkit'
                          ? item.blinkit
                          : item.instamart}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.modalDivider} />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Grocery Packs Total:</Text>
                  <Text style={styles.totalValue}>₹{currentStoreData.totalPackCost}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Delivery Fee:</Text>
                  <Text style={styles.totalValue}>
                    {currentStoreData.deliveryFee === 0 ? 'FREE' : `₹${currentStoreData.deliveryFee}`}
                  </Text>
                </View>
                <View style={[styles.totalRow, { marginTop: 4 }]}>
                  <Text style={styles.grandLabel}>To Pay:</Text>
                  <Text style={styles.grandValue}>₹{currentStoreData.grandTotal}</Text>
                </View>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleSimulateOrder}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmBtnText}>Confirm Instant Dispatch</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setCheckoutModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.successContainer}>
                <CheckCircle2 size={56} color="#059669" />
                <Text style={styles.successTitle}>Groceries Dispatched! 🚀</Text>
                <Text style={styles.successMsg}>
                  Your {currentStoreData.name} rider is heading to your room in {currentStoreData.deliveryMinutes} minutes!
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald
  },
  liveText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '800'
  },
  subtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: 12
  },
  storesGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  storeCard: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative'
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },
  cheapestCardBorder: {
    borderColor: Colors.emerald
  },
  cheapestBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: Colors.emerald,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8
  },
  cheapestBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  storeName: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4
  },
  deliveryTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2
  },
  priceTag: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 4
  },
  packNote: {
    fontSize: 10,
    color: Colors.textMuted
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.emeraldLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    gap: 6,
    marginBottom: 12
  },
  savingsText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1
  },
  savingsBold: {
    fontWeight: '800'
  },
  savingsAmount: {
    color: '#047857',
    fontWeight: '900'
  },
  portionCostExplainer: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14
  },
  portionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C2410C',
    marginBottom: 3
  },
  portionExplanation: {
    fontSize: 11,
    color: '#7C2D12',
    lineHeight: 16
  },
  portionAmountHighlight: {
    color: Colors.primary,
    fontWeight: '800'
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 6,
    ...Colors.shadow
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.textPrimary
  },
  modalSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 16
  },
  itemsList: {
    maxHeight: 220
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  itemUnit: {
    fontSize: 11,
    color: Colors.textSecondary
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.textSecondary
  },
  totalValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '700'
  },
  grandLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  grandValue: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.primary
  },
  confirmBtn: {
    backgroundColor: Colors.emerald,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: 13
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 30
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 16
  },
  successMsg: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20
  }
});
